package com.huawei.showcase.model.request;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.huawei.showcase.model.request.Request;

@XmlRootElement(name="SynUserDataReq")
public class SynUserDataReq extends Request
{
  private List<String> wiNameList;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[UNS>>ITA]req:");
    builder.append(",wiNameList=" + this.wiNameList);

    return builder.toString();
  }

  public List<String> getWiNameList() {
    return this.wiNameList;
  }

  public void setWiNameList(List<String> wiNameList)
  {
    this.wiNameList = wiNameList;
  }
}