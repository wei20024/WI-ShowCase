package com.huawei.showcase.model.request;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import com.huawei.showcase.model.ConfigInfo;

@XmlRootElement(name="saveModuleMessageReq")
public class SaveModuleMessageReq extends CommonReq
{
  private static final long serialVersionUID = 167890L;
  private int configType;
  private List<ConfigInfo> configList;


  public int getConfigType()
  {
    return this.configType;
  }

  public void setConfigType(int configType)
  {
    this.configType = configType;
  }

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public List<ConfigInfo> getConfigList()
  {
    return this.configList;
  }

  public void setConfigList(List<ConfigInfo> configList)
  {
    this.configList = configList;
  }


}