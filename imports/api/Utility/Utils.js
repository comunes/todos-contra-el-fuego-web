/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */

export const defaultCreatedAt = {
  type: Date,
  // autoform: { type: 'hidden' },
  // Prefer normal function: https://github.com/aldeed/meteor-simple-schema/issues/562
  autoValue: function autovalue() {
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
  autoValue: function autovalue() {
    if (this.isUpdate || this.isInsert) {
      return new Date();
    }
  },
  // Commented because we want to have updateAt = createAt initialy
  // denyInsert: true,
  optional: true
};
