package com.huawei.showcase.model.response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import com.huawei.showcase.model.AppModel;

@XmlRootElement(name="GetAppRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetAppRsp extends CommonRsp
{
  private static final long serialVersionUID = -4501347936923280698L;

  @XmlElement(name="appInfos")
  private List<AppModel> appInfos;

  @XmlElement(name="myAppInfos")
  private List<AppModel> myAppInfos;
  private Map<String, String> ipTokens = new HashMap<String, String>();

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public List<AppModel> getAppInfos()
  {
    return this.appInfos;
  }

  public void setAppInfos(List<AppModel> appInfos)
  {
    this.appInfos = appInfos;
  }

  public List<AppModel> getMyAppInfos()
  {
    return this.myAppInfos;
  }

  public void setMyAppInfos(List<AppModel> myAppInfos)
  {
    this.myAppInfos = myAppInfos;
  }

  public Map<String, String> getIpTokens()
  {
    return this.ipTokens;
  }

  public void setIpTokens(Map<String, String> ipTokens)
  {
    this.ipTokens = ipTokens;
  }
}