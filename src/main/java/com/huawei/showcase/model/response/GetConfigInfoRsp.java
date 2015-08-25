package com.huawei.showcase.model.response;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetConfigInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetConfigInfoRsp extends CommonRsp
{
  private static final long serialVersionUID = 1257766317176525L;

  @XmlElement(name="config")
  private List<GetConfigInfoMapRsp> configKey;

  public List<GetConfigInfoMapRsp> getConfigKey()
  {
    return this.configKey;
  }

  public void setConfigKey(List<GetConfigInfoMapRsp> configKey)
  {
    this.configKey = configKey;
  }
}