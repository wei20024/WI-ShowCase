package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="QueryVmStatusRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class QueryVmStatusRsp extends CommonRsp
{
  private static final long serialVersionUID = 1256766317176525L;

  @XmlElement(name="vmStatus")
  private String vmStatus;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public String getVmStatus()
  {
    return this.vmStatus;
  }

  public void setVmStatus(String vmStatus)
  {
    this.vmStatus = vmStatus;
  }
}