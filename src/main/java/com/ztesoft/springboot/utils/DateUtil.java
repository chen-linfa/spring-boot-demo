package com.ztesoft.springboot.utils;

import com.github.pagehelper.StringUtil;
import com.ztesoft.springboot.common.Const;
import org.apache.commons.lang.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@SuppressWarnings({"unchecked", "rawtypes"})
public class DateUtil {

    public static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /**
     * 获取当前时间
     *
     * @return
     */
    public static String getNow() {
        Calendar calendar = Calendar.getInstance();
        return format(calendar.getTime());
    }

    /**
     * 日期格式化(默认格式：yyyy-MM-dd HH:mm:ss)
     *
     * @param date
     * @return
     */
    public static String format(Date date) {
        return format(date, DEFAULT_PATTERN);
    }

    /**
     * 日期格式化
     *
     * @param date
     * @param pattern
     * @return
     */
    public static String format(Date date, String pattern) {
        if (date == null) {
            return "";
        }

        DateFormat format = new SimpleDateFormat(pattern);
        return format.format(date);
    }

    /**
     * 日期字符串转换成日期对象
     *
     * @param source
     * @return
     * @throws Exception
     */
    public static Date parse(String source) throws Exception {
        DateFormat format = new SimpleDateFormat(DEFAULT_PATTERN);
        return format.parse(source);
    }

    /**
     * 日期字符串转换成日期对象
     *
     * @param source
     * @return
     * @throws Exception
     */
    public static Date parse(String source, String dateFormat) throws Exception {
        DateFormat format = new SimpleDateFormat(dateFormat);
        return format.parse(source);
    }

    /**
     * 把时间和单转换成秒(如time="1"，unit="MINUTE"，表示1分钟，转换之后返回60秒)
     *
     * @param time
     * @param unit
     * @return
     */
    public static int timeToSeconds(String time, String unit) {
        if (StringUtils.isBlank(time)) {
            return 0;
        }

        int second = 0;
        try {
            second = Integer.parseInt(time);
        } catch (Exception e) {
            //log.error(e);
        }

        if (Const.TOKEN_EXP_UNIT_MINUTE.equals(unit)) {
            second = second * 60;//分转秒
        } else if (Const.TOKEN_EXP_UNIT_HOUR.equals(unit)) {
            second = second * 3600;//时转秒
        } else if (Const.TOKEN_EXP_UNIT_DAY.equals(unit)) {
            second = second * 24 * 3600;//天转秒
        } else {
            //秒
        }

        return second;
    }

    /**
     * 获取本日，格式：yyyy-MM-dd
     *
     * @return
     */
    public static String getCurDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }

    /**
     * 获取本月，格式：yyyyMM
     *
     * @return
     */
    public static String getCurMonth() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        return sdf.format(new Date());
    }

    /**
     * 获取上月，格式：yyyyMM
     *
     * @return
     */
    public static String getPreMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.MONTH, calendar.get(Calendar.MONTH) - 1);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
        return sdf.format(calendar.getTime());
    }

    /**
     * 获取[startDate~endDate]间（含）所有的日期<br>
     *
     * @param startDate yyyyMMdd
     * @param endDate   yyyyMMdd
     * @return 日期列表
     * @throws ParseException
     * @author zhou.bin
     */
    public static List<String> getDateList(String startDate, String endDate) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Date fromDate = sdf.parse(startDate);
        Date toDate = sdf.parse(endDate);
        Calendar from = Calendar.getInstance();
        from.setTime(fromDate);
        Calendar to = Calendar.getInstance();
        to.setTime(toDate);
        List<String> list = new ArrayList<String>();
        while (from.getTime().getTime() <= to.getTime().getTime()) {
            list.add(sdf.format(from.getTime()));
            from.set(Calendar.DATE, from.get(Calendar.DATE) + 1);
        }
        return list;
    }


    /**
     * 比较两个日期之差（秒）
     *
     * @param dateStr1
     * @param dateStr2
     * @param pattern
     * @return
     */
    public static int getSecByStrs(String dateStr1, String dateStr2) throws Exception {
        if (StringUtil.isEmpty(dateStr1) || StringUtil.isEmpty(dateStr2)) {
            return 0;
        }
        Date date1 = parse(dateStr1);
        Date date2 = parse(dateStr2);
        return getSecs(date1, date2);
    }

    /**
     * 获取两个日期之差
     *
     * @param date1
     * @param date2
     * @return
     */
    public static int getSecs(Date date1, Date date2) {
        if (date1 == null || date2 == null) {
            return 0;
        } else {
            return (int) ((date2.getTime() - date1.getTime()) / 1000); // 代表毫秒
        }
    }

    public static void main(String[] args) throws Exception {
    }
}