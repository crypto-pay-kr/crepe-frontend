import React from "react";
import MenuItem from "./MenuItem";

export interface MenuItemData {
  id: number;
  name: string;
  price: number | string;
  currency: string;
  image: string;
}

interface MenuListProps {
  menuItems?: MenuItemData[];
  addToCart?: (item: { id: number; name: string; price: number }) => void;
}

function MenuList({ menuItems, addToCart }: MenuListProps) {
  const items = menuItems || [];

  return (
    <div className="self-center mt-6 w-full" aria-labelledby="menu-heading">
      <h2 id="menu-heading" className="sr-only">
        Restaurant Menu
      </h2>
      <ul className="p-4 w-full">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <MenuItem
              name={item.name}
              price={item.price}
              currency={item.currency}
              image={item.image}
              onClick={() => {
                if (addToCart) {
                  const priceNumber = typeof item.price === "string"
                    ? parseInt(item.price.replace(/,/g, ""), 10)
                    : item.price;
                  addToCart({ id: item.id, name: item.name, price: priceNumber });
                }
              }}
            />
            {index < items.length - 1 && (
              <div className="mt-2.5 max-w-full min-h-0 border border-solid border-neutral-100 w-[308px]" />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default MenuList;
