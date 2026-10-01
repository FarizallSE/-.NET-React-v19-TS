interface Props {
  name: string;
  description: string;
  image?: string;
}

const Pizza = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center loading-normal">
      <h1 className="text-[25px] font-normal text-secondary">{props.name}</h1>
      <p className="mb-1.25">{props.description}</p>
      <img
        className = "max-w-50 rounded-[5px] border border-border"
        src={props.image ? props.image : "https://picsum.photos/200"}
        alt={props.name}
      />
    </div>
  );
};

export default Pizza;
