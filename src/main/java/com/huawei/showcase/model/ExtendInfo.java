package com.huawei.showcase.model;

import java.io.Serializable;

public class ExtendInfo
  implements Serializable
{
  private static final long serialVersionUID = 9876543L;
  private String key;
  private String value;

  public ExtendInfo(String key, String value)
  {
    this.key = key;
    this.value = value;
  }

  public String getKey()
  {
    return this.key;
  }

  public String getValue()
  {
    return this.value;
  }

  public void setKey(String key)
  {
    this.key = key;
  }

  public void setValue(String value)
  {
    this.value = value;
  }

  public String toString()
  {
    StringBuilder strBuilder = new StringBuilder();
    strBuilder.append(this.key + "=" + this.value);

    return strBuilder.toString();
  }
}