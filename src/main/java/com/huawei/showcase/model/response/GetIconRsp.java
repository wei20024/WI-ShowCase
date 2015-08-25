package com.huawei.showcase.model.response;


import com.huawei.showcase.model.IconInfoModel;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetIconRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetIconRsp extends CommonRsp
{
  private static final long serialVersionUID = -4501347936923280698L;

  @XmlElement(name="iconInfos")
  private List<IconInfoModel> iconInfos;

  @XmlElement(name="appIdList")
  private List<String> appIdList;

  public String toString()
  {
    StringBuilder sb = new StringBuilder();

    sb.append("iconInfos = " + this.iconInfos + ". ");

    return sb.toString();
  }

  public List<IconInfoModel> getIconInfos()
  {
    return this.iconInfos;
  }

  public void setIconInfos(List<IconInfoModel> iconInfos)
  {
    this.iconInfos = iconInfos;
  }

  public List<String> getAppIdList()
  {
    return this.appIdList;
  }

  public void setAppIdList(List<String> appIdList)
  {
    this.appIdList = appIdList;
  }
}