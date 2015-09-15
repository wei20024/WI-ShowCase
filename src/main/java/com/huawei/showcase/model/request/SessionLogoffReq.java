package com.huawei.showcase.model.request;

import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="SessionLogoffReq")
public class SessionLogoffReq extends UnsCommonReq
{
  private static final long serialVersionUID = 8729400204108356748L;
  private String farmId;
  private List<String> sessionInfoIdList;

  public List<String> getSessionInfoIdList()
  {
    return this.sessionInfoIdList;
  }

  public void setSessionInfoIdList(List<String> sessionInfoIdList)
  {
    this.sessionInfoIdList = sessionInfoIdList;
  }

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("LogoffSessionsReq:sessionInfoIdList=" + this.sessionInfoIdList);
    return builder.toString();
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }
}