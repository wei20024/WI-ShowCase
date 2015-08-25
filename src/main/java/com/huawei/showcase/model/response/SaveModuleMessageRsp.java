package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="SaveModuleRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class SaveModuleMessageRsp extends CommonRsp
{
  private static final long serialVersionUID = 77747663051717895L;

  @XmlElement(name="isSuccess")
  private Boolean isSuccess;

  public Boolean getIsSuccess()
  {
    return this.isSuccess;
  }

  public void setIsSuccess(Boolean isSuccess)
  {
    this.isSuccess = isSuccess;
  }
}