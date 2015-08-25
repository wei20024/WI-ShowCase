package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetConfigInfoMapRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetConfigInfoMapRsp
{
  @XmlElement(name="key")
  private String key;

  @XmlElement(name="value")
  private String value;

  public String getValue()
  {
    return this.value;
  }

  public void setValue(String value)
  {
    this.value = value;
  }

  public String getKey()
  {
    return this.key;
  }

  public void setKey(String key)
  {
    this.key = key;
  }
}