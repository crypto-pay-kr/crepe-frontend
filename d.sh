#!/bin/bash
# UTF-8 설정
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 설정값
HEALTH_CHECK_WAIT=10  # 헬스 체크 재시도 간격(초)
HEALTH_CHECK_TIMEOUT=100  # 헬스체크 타임아웃 (초)
PORT=8080             # 애플리케이션 포트
KEEP_IMAGES=3         # 유지할 이미지 개수

# Docker 이미지 정보
DOCKER_USERNAME="$1"  # 첫 번째 인자: Docker Username
DOCKER_REPO="$2"      # 두 번째 인자: Docker Repository
IMAGE_TAG="$3"        # 세 번째 인자: Image Tag (Github SHA)
DOCKER_IMAGE="$DOCKER_USERNAME/$DOCKER_REPO:$IMAGE_TAG"
LOCAL_IMAGE="$DOCKER_REPO:latest"

echo "===== Backend Deployment Start: $(date) ====="
echo "Deployment Image: $DOCKER_IMAGE"

# Docker 로그인 상태 확인
echo "Checking Docker login status..."
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not logged in"
  exit 1
fi

# 포트 사용 중인 프로세스 확인 함수
check_port_usage() {
  local port=$1
  echo "Checking port $port usage..."
  
  # 1. 시스템 레벨에서 포트 사용 확인
  PORT_USAGE=$(netstat -tlnp 2>/dev/null | grep ":$port " || lsof -i :$port 2>/dev/null || true)
  
  # 2. Docker 컨테이너에서 포트 사용 확인
  DOCKER_PORT_USAGE=""
  for container in $(docker ps --format "{{.Names}}" 2>/dev/null); do
    PORT_MAPPING=$(docker port "$container" 2>/dev/null | grep ":$port$" || true)
    if [ ! -z "$PORT_MAPPING" ]; then
      DOCKER_PORT_USAGE="$DOCKER_PORT_USAGE\nContainer $container: $PORT_MAPPING"
    fi
  done
  
  if [ ! -z "$PORT_USAGE" ] || [ ! -z "$DOCKER_PORT_USAGE" ]; then
    echo "Port $port is currently in use:"
    [ ! -z "$PORT_USAGE" ] && echo "System processes:" && echo "$PORT_USAGE"
    [ ! -z "$DOCKER_PORT_USAGE" ] && echo "Docker containers:" && echo -e "$DOCKER_PORT_USAGE"
    return 0
  else
    echo "Port $port is available"
    return 1
  fi
}

# 현재 실행 중인 컨테이너 확인 (개선된 방법)
echo "Checking current running containers..."
CURRENT_CONTAINER=""

# 방법 1: 포트를 사용하는 컨테이너 찾기
echo "Searching for containers using port $PORT..."
for container in $(docker ps --format "{{.Names}}"); do
  PORT_MAPPING=$(docker port "$container" 2>/dev/null | grep ":$PORT$" || true)
  if [ ! -z "$PORT_MAPPING" ]; then
    CURRENT_CONTAINER="$container"
    echo "Found container using port $PORT: $CURRENT_CONTAINER"
    break
  fi
done

# 방법 2: 프로젝트 이름 패턴으로 컨테이너 찾기 (포트 기반 검색이 실패한 경우)
if [ -z "$CURRENT_CONTAINER" ]; then
  echo "No container found by port. Searching by name pattern..."
  # 현재 프로젝트와 관련된 실행 중인 컨테이너들 찾기
  PROJECT_CONTAINERS=$(docker ps --format "{{.Names}}" | grep -E "${DOCKER_REPO}-(blue|green)$" || true)
  
  if [ ! -z "$PROJECT_CONTAINERS" ]; then
    echo "Found project containers:"
    echo "$PROJECT_CONTAINERS"
    
    # 가장 최근에 실행된 컨테이너 선택
    CURRENT_CONTAINER=$(echo "$PROJECT_CONTAINERS" | head -n 1)
    echo "Selected current container: $CURRENT_CONTAINER"
  else
    echo "No project containers found by name pattern either"
  fi
fi

# blue-green 배포를 위한 컨테이너 이름 설정
if [[ "$CURRENT_CONTAINER" == *"-blue" ]]; then
  NEXT_CONTAINER_NAME="$DOCKER_REPO-green"
elif [[ "$CURRENT_CONTAINER" == *"-green" ]]; then
  NEXT_CONTAINER_NAME="$DOCKER_REPO-blue"
else
  # 첫 배포이거나 이름 패턴이 다른 경우
  NEXT_CONTAINER_NAME="$DOCKER_REPO-blue"
fi

echo "Current running container: ${CURRENT_CONTAINER:-"None"}"
echo "Next container to deploy: $NEXT_CONTAINER_NAME"

# Docker 이미지 가져오기 및 태그 설정
echo "Pulling Docker image..."
if ! docker pull "$DOCKER_IMAGE"; then
  echo "Error: Failed to pull image $DOCKER_IMAGE. Please check if the image exists and credentials are correct."
  exit 1
fi

echo "Tagging Docker image..."
docker tag "$DOCKER_IMAGE" "$LOCAL_IMAGE"

# 이전에 존재하는 동일 이름의 컨테이너 정리
echo "Cleaning up existing $NEXT_CONTAINER_NAME container..."
docker stop "$NEXT_CONTAINER_NAME" 2>/dev/null || true
docker rm "$NEXT_CONTAINER_NAME" 2>/dev/null || true

# 포트 충돌 해결 - 강화된 로직
echo "Checking and resolving port conflicts..."
if check_port_usage $PORT; then
  echo "Port $PORT is in use. Attempting to resolve..."
  
  # 1. 먼저 모든 관련 컨테이너 찾아서 중지
  CONTAINERS_USING_PORT=$(docker ps --format "{{.Names}}" | while read container; do
    if docker port "$container" 2>/dev/null | grep -q ":$PORT$"; then
      echo "$container"
    fi
  done)
  
  if [ ! -z "$CONTAINERS_USING_PORT" ]; then
    echo "Found containers using port $PORT:"
    echo "$CONTAINERS_USING_PORT"
    
    # 컨테이너들 중지
    echo "$CONTAINERS_USING_PORT" | while read container; do
      if [ ! -z "$container" ]; then
        echo "Stopping container: $container"
        docker stop "$container" 2>/dev/null || true
      fi
    done
    
    # 컨테이너가 완전히 멈출 때까지 대기
    echo "Waiting for containers to stop completely..."
    sleep 5
  fi
  
  # 2. Docker 네트워크 정리 (좀비 엔드포인트 제거)
  echo "Cleaning up Docker networks..."
  docker network prune -f 2>/dev/null || true
  
  # 3. 포트가 여전히 사용 중인지 재확인
  sleep 2
  if check_port_usage $PORT; then
    echo "Port $PORT is still in use. Attempting additional cleanup..."
    
    # Docker 시스템 정리
    docker system prune -f 2>/dev/null || true
    
    # 마지막 수단: 포트를 사용하는 프로세스 강제 종료
    echo "Attempting to force-kill processes using port $PORT..."
    fuser -k $PORT/tcp 2>/dev/null || true
    pkill -f ":$PORT" 2>/dev/null || true
    
    sleep 3
    
    # 최종 확인
    if check_port_usage $PORT; then
      echo "ERROR: Unable to free port $PORT. Manual intervention required."
      echo "Please run the following commands manually:"
      echo "1. sudo lsof -i :$PORT"
      echo "2. sudo kill -9 <PID>"
      echo "3. sudo systemctl restart docker (if necessary)"
      exit 1
    fi
  fi
  
  echo "Port $PORT has been successfully freed."
else
  echo "Port $PORT is available for use."
fi

# 새 컨테이너 실행
echo "Starting new container..."
if ! docker run -d --name "$NEXT_CONTAINER_NAME" \
  -p $PORT:$PORT \
  -v $(pwd)/config:/usr/app \
  -e SPRING_CONFIG_LOCATION=file:/usr/app/application.yml \
  -v ~/logs:/usr/app/logs \
  -e TZ=Asia/Seoul \
  -e AGENT_NAME=crepe-back-dev \
  --restart=always "$LOCAL_IMAGE"; then
  echo "Error: Failed to start container"
  
  # 실패시 이전 컨테이너 복구
  if [ ! -z "$CURRENT_CONTAINER" ]; then
    echo "Rolling back to previous container ($CURRENT_CONTAINER)..."
    docker start "$CURRENT_CONTAINER" 2>/dev/null || true
  fi
  exit 1
fi

# 컨테이너 헬스체크
echo "Performing health check..."
HEALTH_CHECK_COUNT=0
CONTAINER_HEALTHY=false

while [ $HEALTH_CHECK_COUNT -lt $HEALTH_CHECK_TIMEOUT ]; do
  # 컨테이너가 실행 중인지 확인
  if ! docker ps | grep -q "$NEXT_CONTAINER_NAME"; then
    echo "Error: Container stopped unexpectedly"
    echo "Container logs:"
    docker logs "$NEXT_CONTAINER_NAME" | tail -20
    
    # 실패시 이전 컨테이너 복구
    if [ ! -z "$CURRENT_CONTAINER" ]; then
      echo "Rolling back to previous container ($CURRENT_CONTAINER)..."
      docker start "$CURRENT_CONTAINER" 2>/dev/null || true
    fi
    exit 1
  fi
  
  # HTTP 응답 확인
  RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null || echo "000")
  if [ "$RESPONSE_CODE" != "000" ] && [ "$RESPONSE_CODE" != "Connection refused" ]; then
    echo "Health check passed! Container is responding. (Response Code: $RESPONSE_CODE)"
    CONTAINER_HEALTHY=true
    break
  fi
  
  echo "Waiting for container to be ready... ($((HEALTH_CHECK_COUNT + 1))/$HEALTH_CHECK_TIMEOUT) - Response: $RESPONSE_CODE"
  sleep 1
  HEALTH_CHECK_COUNT=$((HEALTH_CHECK_COUNT + 1))
done

if [ "$CONTAINER_HEALTHY" = false ]; then
  echo "Error: Container health check failed after $HEALTH_CHECK_TIMEOUT seconds"
  echo "Container logs:"
  docker logs "$NEXT_CONTAINER_NAME" | tail -20
  
  # 새 컨테이너 정리
  docker stop "$NEXT_CONTAINER_NAME" 2>/dev/null || true
  docker rm "$NEXT_CONTAINER_NAME" 2>/dev/null || true
  
  # 실패시 이전 컨테이너 복구
  if [ ! -z "$CURRENT_CONTAINER" ]; then
    echo "Rolling back to previous container ($CURRENT_CONTAINER)..."
    docker start "$CURRENT_CONTAINER" 2>/dev/null || true
  fi
  exit 1
fi

echo "New container ($NEXT_CONTAINER_NAME) successfully started and healthy"

# 배포 성공 시 이전 컨테이너 정리
if [ ! -z "$CURRENT_CONTAINER" ]; then
  echo "Removing previous container ($CURRENT_CONTAINER)..."
  docker rm "$CURRENT_CONTAINER" 2>/dev/null || true
fi

# 개선된 이미지 정리
echo "Cleaning up unused Docker images..."

# 1. dangling 이미지 (태그가 없는 이미지) 정리
DANGLING_IMAGES=$(docker images -f "dangling=true" -q 2>/dev/null || true)
if [ ! -z "$DANGLING_IMAGES" ]; then
  echo "Removing dangling images..."
  echo "$DANGLING_IMAGES" | xargs docker rmi -f 2>/dev/null || true
fi

# 2. 현재 애플리케이션과 관련된 오래된 이미지 정리
if [ ! -z "$DOCKER_USERNAME" ] && [ ! -z "$DOCKER_REPO" ]; then
  echo "Cleaning up old repository images..."
  
  # 현재 레포지토리의 모든 이미지 가져오기 (생성 시간 기준 정렬)
  OLD_IMAGES=$(docker images "$DOCKER_USERNAME/$DOCKER_REPO" --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | \
    tail -n +2 | \
    sort -k3 -r | \
    tail -n +$((KEEP_IMAGES + 1)) | \
    awk '{print $2}' || true)
  
  if [ ! -z "$OLD_IMAGES" ]; then
    echo "Removing old repository images:"
    echo "$OLD_IMAGES" | while read -r image_id; do
      if [ ! -z "$image_id" ]; then
        echo "- Removing image: $image_id"
        docker rmi -f "$image_id" 2>/dev/null || true
      fi
    done
  else
    echo "No old repository images to remove"
  fi
fi

# 3. 사용되지 않는 모든 이미지 정리 (선택적)
echo "Removing unused images..."
docker image prune -f 2>/dev/null || true

# 최종 상태 확인
echo "Final deployment status:"
docker ps | grep "$NEXT_CONTAINER_NAME" || echo "Warning: Container not found in running processes"

echo "===== Backend Deployment Complete: $(date) ====="
echo "Container: $NEXT_CONTAINER_NAME"
echo "Access URL: http://localhost:$PORT"
echo "Docker images count: $(docker images | grep "$DOCKER_USERNAME/$DOCKER_REPO" | wc -l)"