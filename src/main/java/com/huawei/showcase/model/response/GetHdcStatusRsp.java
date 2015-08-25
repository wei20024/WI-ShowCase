package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetHdcStatusRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetHdcStatusRsp extends CommonRsp
{
  private static final long serialVersionUID = -624297626574880L;

  @XmlElement(name="hdcState")
  private String hdcState;

  public String getHdcState()
  {
    return this.hdcState;
  }

  public void setHdcState(String hdcState)
  {
    this.hdcState = hdcState;
  }
}