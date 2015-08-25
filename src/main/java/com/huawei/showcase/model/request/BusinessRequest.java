package com.huawei.showcase.model.request;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class BusinessRequest
{
  private String operatorId;

  public String getOperatorId()
  {
    return this.operatorId;
  }

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public void setOperatorId(String operatorId)
  {
    this.operatorId = operatorId;
  }
}