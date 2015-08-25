package com.huawei.showcase.model.request;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.huawei.showcase.model.AppModel;
import com.huawei.showcase.common.util.CommonUtils;

@XmlRootElement(name="GetIconReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetIconReq extends UnsCommonReq
{
  private static final long serialVersionUID = 8502585880667L;

  @XmlElement(name="appList")
  private List<AppModel> appList;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("GetAppIconReq:appList=" + this.appList + ", ");

    return builder.toString();
  }

  public boolean isValid()
  {
    if (CommonUtils.checkCollectionNullOrEmpty(this.appList))
    {
      return false;
    }

    return true;
  }

  public List<AppModel> getAppList()
  {
    return this.appList;
  }

  public void setAppList(List<AppModel> appList)
  {
    this.appList = appList;
  }
}