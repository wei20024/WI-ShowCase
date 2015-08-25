package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ExtendFunctionRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class ExtendFunctionRsp extends CustomRsp
{
  private static final long serialVersionUID = 777476630517176525L;

  @XmlElement(name="rspInfo")
  private String rspInfo;

public String getRspInfo() {
	return rspInfo;
}

public void setRspInfo(String rspInfo) {
	this.rspInfo = rspInfo;
}
}