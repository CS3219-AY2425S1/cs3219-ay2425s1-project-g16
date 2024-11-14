export const getEmptyFieldErrorMessage = (fieldName: string) => {
  return `${fieldName} must not be empty`;
};

export const getFieldMinLengthErrorMessage = (fieldName: string, length: number) => {
  return `${fieldName} must contain at least ${length} character(s)`;
};

export const getFieldMaxLengthErrorMessage = (fieldName: string, length: number) => {
  return `${fieldName} must contain at most ${length} character(s)`;
};
