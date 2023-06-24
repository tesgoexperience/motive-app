import moment from "moment";


export default class DateUtil {

    /**
     * Gets a date makes its time and date digits. So 1/5/2022 9:20 would become 01/05/2022 09:20
     * @param date 
     * @returns the date the date with 2 or more digits
     */
    public static toString(date: Date | number): String {
        date = DateUtil.toDate(date);
        let addZero = (val: number) => { return val < 10 ? "0" + val : val }
        return date.getDate() + "/" + addZero(date.getMonth() + 1) + "/" + addZero(date.getFullYear()) + "  " + addZero(date.getHours()) + ":" + addZero(date.getMinutes());
    }

    public static toDate(date: Date | number): Date {
        return typeof (date) == 'number' ? new Date(date) : date;
    }

    /**
     * if the difference is 60 secs the it will return the difference in seconds. If the difference is less than 60 minutes then it will return the difference in minutes... Upto a years difference
     * @param date1 
     * @param date2 
     */
    public static diff(start: Date | number, end: Date | number) {
        const diffDuration = moment.duration(moment(end).diff(moment(start)));

        if (diffDuration.years() >= 1) {
            return diffDuration.years() + " year(s)";
        }

        if (diffDuration.months() >= 1) {
            return diffDuration.months() + " month(s)";
        }

        if (diffDuration.days() >= 1) {
            return diffDuration.days() + " day(s)";
        }

        if (diffDuration.hours() >= 1) {
            return diffDuration.hours() + " hour(s)";
        }

        if (diffDuration.minutes() >= 1) {
            return diffDuration.minutes() + " minute(s)";
        }

        return diffDuration.seconds() + " seconds(s)";

    }

} 
