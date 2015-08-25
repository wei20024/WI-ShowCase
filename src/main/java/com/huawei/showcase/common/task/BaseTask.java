package com.huawei.showcase.common.task;

import com.huawei.showcase.common.util.log.TransactionIdUtil;

public abstract class BaseTask implements Runnable
{
  private String transactionId;

  public void run()
  {
    TransactionIdUtil.setCurrentTransactionId(this.transactionId);
    doTask();
  }

  public abstract void doTask();

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }
}