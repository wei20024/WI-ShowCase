package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="GetPublicInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetPublicInfoRsp extends CommonRsp
{
  /**
	 * 
	 */
	private static final long serialVersionUID = 4292799510832982654L;
private String value;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public String getValue() {
    return this.value;
  }

  public void setValue(String value)
  {
    this.value = value;
  }
}