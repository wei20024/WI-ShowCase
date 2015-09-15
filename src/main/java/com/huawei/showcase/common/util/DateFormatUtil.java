package com.huawei.showcase.common.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.huawei.showcase.common.util.log.LogUtils;

public final class DateFormatUtil
{
  private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
  private static final String DAY_FORMAT = "yyyy-MM-dd";

  public static Date parse(String date)
  {
    try
    {
      return new SimpleDateFormat(DATE_FORMAT).parse(date);
    }
    catch (ParseException e)
    {
      LogUtils.LOG.error(String.format("Failed to parse %s to Date.", date ), e);
    }return null;
  }

  public static Date parseDay(String date)
  {
    try
    {
      return new SimpleDateFormat(DAY_FORMAT).parse(date);
    }
    catch (ParseException e)
    {
      LogUtils.LOG.error(String.format("Failed to parse %s to Date.",  date ), e);
    }return null;
  }

  public static String format(Date date)
  {
    if (date == null)
    {
      LogUtils.LOG.error("date is null.");
      return null;
    }
    return new SimpleDateFormat(DATE_FORMAT).format(date);
  }

  public static Timestamp getTimestamp(String time)
  {
    if (CommonUtils.checkAllStringNull( time ))
    {
      return null;
    }

    return Timestamp.valueOf(time);
  }

  public static String format(Timestamp timestamp)
  {
    if (timestamp == null)
    {
      LogUtils.LOG.error("timestamp is null.");
      return null;
    }

    return new SimpleDateFormat(DATE_FORMAT).format(timestamp);
  }

  public static String localTimeToUTC(Timestamp time)
  {
    if (time == null)
    {
      LogUtils.LOG.error("time is null.");
      return null;
    }

    Calendar calendar = Calendar.getInstance();
    calendar.setTimeInMillis(time.getTime());

    int zoneOffsets = calendar.get(15);

    int dstOffsets = calendar.get(16);

    calendar.add(14, -(zoneOffsets + dstOffsets));
    String strDate = format(new Timestamp(calendar.getTimeInMillis()));

    return strDate;
  }

  public static Calendar localTimeToUTC(Calendar calendar)
  {
    if (calendar == null)
    {
      LogUtils.LOG.error("time is null.");
      return null;
    }

    int zoneOffsets = calendar.get(15);

    int dstOffsets = calendar.get(16);

    calendar.add(14, -(zoneOffsets + dstOffsets));

    return calendar;
  }

  public static Timestamp localTimeToUTC()
  {
    Calendar calendar = Calendar.getInstance();

    int zoneOffsets = calendar.get(15);

    int dstOffsets = calendar.get(16);

    calendar.add(14, -(zoneOffsets + dstOffsets));

    return new Timestamp(calendar.getTimeInMillis());
  }

  public static String localTimeToUTCString()
  {
    Calendar calendar = Calendar.getInstance();

    int zoneOffsets = calendar.get(15);

    int dstOffsets = calendar.get(16);

    calendar.add(14, -(zoneOffsets + dstOffsets));

    return format(new Timestamp(calendar.getTimeInMillis()));
  }

  public static String localDateUTCString()
  {
    Calendar calendar = Calendar.getInstance();

    int zoneOffsets = calendar.get(15);

    int dstOffsets = calendar.get(16);

    calendar.add(14, -(zoneOffsets + dstOffsets));

    return new SimpleDateFormat(DAY_FORMAT).format(new Timestamp(calendar.getTimeInMillis()));
  }

  public static long timeToMillis(String time, String format)
  {
    SimpleDateFormat sdf = new SimpleDateFormat(format);
    Date date = null;
    try
    {
      date = sdf.parse(time);
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
      return 0L;
    }
    return date.getTime();
  }

  public static int getSystemWeek()
  {
    Date date = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTime(date);
    return cal.get(7);
  }

  public static int getSystemHour()
  {
    Calendar c = Calendar.getInstance();
    return c.get(11);
  }
}