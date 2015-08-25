package com.huawei.showcase.common.util.log;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class TransactionIdUtil
{
  private static final int MAX_TASK_NUM = 1000;
  private static Map<Long, String> threadTransactionIdMap = new ConcurrentHashMap<Long, String>(1000);

  public static String getCurrentTransactionId()
  {
    return (String)threadTransactionIdMap.get(Long.valueOf(Thread.currentThread().getId()));
  }

  public static String setCurrentTransactionId(String transactionId)
  {
    if (transactionId != null)
    {
      return (String)threadTransactionIdMap.put(Long.valueOf(Thread.currentThread().getId()), transactionId);
    }

    return (String)threadTransactionIdMap.remove(Long.valueOf(Thread.currentThread().getId()));
  }

  public static String removeCurrentTransactionId()
  {
    return (String)threadTransactionIdMap.remove(Long.valueOf(Thread.currentThread().getId()));
  }

public static int getMaxTaskNum() {
	return MAX_TASK_NUM;
}
}