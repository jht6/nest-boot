import * as moment from 'moment';

// 返回格式形如："2022-03-09 11:00:00"
export const dateToLocalString = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};
