package com.huawei.showcase.model.response;

public class BusinessCommonRsp
{
  private int resultCode;
  private String resultDesc;

  public String toString()
  {
    StringBuilder sbStr = new StringBuilder();
    sbStr.append("errorCode: ").append(this.resultCode).append(", errorMessage: ").append(this.resultDesc);
    return sbStr.toString();
  }

  public int getResultCode()
  {
    return this.resultCode;
  }

  public void setResultCode(int resultCode)
  {
    this.resultCode = resultCode;
  }

  public String getResultDesc()
  {
    return this.resultDesc;
  }

  public void setResultDesc(String resultDesc)
  {
    this.resultDesc = resultDesc;
  }
}