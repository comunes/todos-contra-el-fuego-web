/* eslint-disable consistent-return */

export const defaultCreatedAt = {
  type: Date,
  // autoform: { type: 'hidden' },
  autoValue: () => {
    if (this.isInsert) {
      return new Date();
    }
    // Prevent user from supplying their own value
    this.unset();
  }
};

export const defaultUpdateAt = {
  type: Date,
  // autoform: { type: 'hidden' },
  autoValue: () => {
    if (this.isUpdate || this.isInsert) {
      return new Date();
    }
  },
  // Commented because we want to have updateAt = createAt initialy
  // denyInsert: true,
  optional: true
};
