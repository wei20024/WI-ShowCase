package com.huawei.showcase.model.response;

import com.huawei.showcase.common.enumcode.ResultCode;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name="CommonRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class CommonRsp
  implements Serializable
{
  private static final long serialVersionUID = -8501347916923280667L;

  @XmlElement(name="resultCode")
  private int resultCode;

  @XmlElement(name="resultDesc")
  private String resultDesc;

  @XmlTransient
  private boolean isRetry;

  public boolean needRetry()
  {
    if (((ResultCode.SUCCESS.getCode() == getResultCode()) || (ResultCode.LOGIN_IN_EMERGENCY.getCode() == getResultCode())) && (!this.isRetry))
    {
      return true;
    }
    return false;
  }

  public String toString()
  {
    StringBuilder sbStr = new StringBuilder();
    sbStr.append("resultCode: ").append(this.resultCode).append(", resultDesc: ").append(this.resultDesc);
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

  public boolean isRetry()
  {
    return this.isRetry;
  }

  public void setRetry(boolean retry)
  {
    this.isRetry = retry;
  }
}