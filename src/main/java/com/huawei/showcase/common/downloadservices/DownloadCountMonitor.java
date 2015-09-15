package com.huawei.showcase.common.downloadservices;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;

public class DownloadCountMonitor
{
  private static Lock addLock = new ReentrantLock();
  private static Lock decreaseLock = new ReentrantLock();

  private static int curCount = 0;

  private static int limitCount = Configuration.getControllerPropInstance().getInt("downloadlimit", StaticNumber.FIFTYS.getCode());

  public static boolean addCount()
  {
    if (curCount > limitCount)
    {
      LogUtils.LOG.error("addCount ： curCount over limitCount, curCount = " + curCount + 
        ", limitcount = " + limitCount);
      return false;
    }

    addCurCount();

    return true;
  }

  private static void addCurCount()
  {
    addLock.lock();
    curCount += 1;
    addLock.unlock();
  }

  public static boolean decreaseCount()
  {
    decreaseLock.lock();

    curCount -= 1;

    decreaseLock.unlock();
    return true;
  }


  public static boolean downloadFlag()
  {
    if (curCount < limitCount)
    {
      return true;
    }

    LogUtils.LOG.error("curCount over limitCount, curCount = " + curCount + 
      ", limitcount = " + limitCount);
    return false;
  }

  public int getCurCount()
  {
    return curCount;
  }

  public void setCurCount(int curCount)
  {
    DownloadCountMonitor.curCount = curCount;
  }
}