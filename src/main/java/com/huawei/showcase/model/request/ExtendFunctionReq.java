package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ExtendFunctionReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class ExtendFunctionReq extends CustomReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  
  
  @XmlElement(name="functionType")
  private String functionType;

  @XmlElement(name="requestInfo")
  private String requestInfo;

  public String getFunctionType()
  {
    return this.functionType;
  }

  public void setFunctionType(String functionType)
  {
    this.functionType = functionType;
  }

  public String getRequestInfo()
  {
    return this.requestInfo;
  }

  public void setRequestInfo(String requestInfo)
  {
    this.requestInfo = requestInfo;
  }
}