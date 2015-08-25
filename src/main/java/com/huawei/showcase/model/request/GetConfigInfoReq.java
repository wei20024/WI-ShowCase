package com.huawei.showcase.model.request;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetConfigInfoReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetConfigInfoReq extends CommonReq
{
  private static final long serialVersionUID = -8501397823280667L;

  @XmlElement(name="configReq")
  private List<String> configInfoList;

  public List<String> getConfigInfoList()
  {
    return this.configInfoList;
  }

  public void setConfigInfoList(List<String> configInfoList)
  {
    this.configInfoList = configInfoList;
  }
}