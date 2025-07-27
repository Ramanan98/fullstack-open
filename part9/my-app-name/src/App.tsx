interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface HeaderProps {
  name: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

const Header = (props: HeaderProps) => <h1>{props.name}</h1>;

const Content = (props: ContentProps) => (
  <div>
    {props.courseParts.map((part, index) => (
      <p key={index}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </div>
);

const Total = (props: TotalProps) => (
  <p>Number of exercises {props.totalExercises}</p>
);

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
