package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="DescribeVMUserCustomPolicyRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class DescribeVMUserCustomPolicyRsp extends CommonRsp
{
  private static final long serialVersionUID = -6923280667L;

  @XmlElement(name="customVMUserPolicy")
  private int customVMUserPolicy;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public void setCustomVMUserPolicy(int customVMUserPolicy)
  {
    this.customVMUserPolicy = customVMUserPolicy;
  }

  public int getCustomVMUserPolicy()
  {
    return this.customVMUserPolicy;
  }
}