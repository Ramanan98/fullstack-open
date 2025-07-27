interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseInput {
  dailyHours: number[];
  target: number;
}

const parseArguments = (args: string[]): ExerciseInput => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const dailyHours = args.slice(3).map(Number);
  const target = Number(args[2]);

  if (dailyHours.some(isNaN) || isNaN(target)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    dailyHours,
    target,
  };
};

export const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = "you might try harder...";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "good job!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { dailyHours, target } = parseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
