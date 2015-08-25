package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;


@XmlRootElement(name="DescribeVMUserCustomPolicyReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class DescribeVMUserCustomPolicyReq extends UnsCommonReq
{

  /**
	 * 
	 */
	private static final long serialVersionUID = -8017426677909513731L;
@XmlElement(name="sid")
  private String sid;

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
}