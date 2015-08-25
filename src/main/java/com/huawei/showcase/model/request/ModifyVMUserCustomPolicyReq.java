package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;


@XmlRootElement(name="ModifyVMUserCustomPolicyReq")
public class ModifyVMUserCustomPolicyReq extends UnsCommonReq
{

  /**
	 * 
	 */
	private static final long serialVersionUID = -1239095515215768240L;

@XmlElement(name="sid")
  private String sid;

  @XmlElement(name="customVMUserPolicy")
  private int customVMUserPolicy;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
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