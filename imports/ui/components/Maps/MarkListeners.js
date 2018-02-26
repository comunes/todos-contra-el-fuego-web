export const onMarkClick = (history, nasa, id) => {
  // console.log('onClick fired');
  history.push(`/fire/${nasa ? 'active' : 'alert'}/${id}`);
};
