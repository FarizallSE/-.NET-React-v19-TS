import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

// feel free to change en-US / USD to your locale
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PizzaOfTheDay = () => {
  const pizzaOfTheDay = usePizzaOfTheDay();

  if (!pizzaOfTheDay) {
    return <div className="border border-border bt5">Loading...</div>;
  }

  return (
    <div className="border border-border bt-[1px] mt-[50px] w-[100%]">
      <h2 className="text-center">Pizza of the Day</h2>
      <div className="flex  align-center justify-center">
        <div className="mr-[30px] h-[200px] w-[200px] text-center">
          <h3>{pizzaOfTheDay.name}</h3>
          <p>{pizzaOfTheDay.description}</p>
          <p>
            From: <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
          </p>
        </div>
        <img
          className="max-h-[200px] mr-[30px] max-w-[200px] rounded-[30px] border border-border rounded-[5px]"
          src={pizzaOfTheDay.image}
          alt={pizzaOfTheDay.name}
        />
      </div>
    </div>
  );
};

export default PizzaOfTheDay;
