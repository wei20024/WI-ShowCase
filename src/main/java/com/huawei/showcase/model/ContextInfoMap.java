package com.huawei.showcase.model;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class ContextInfoMap implements Serializable
{
  /**
   * 
   */
  private static final long serialVersionUID = 2122682434839756257L;
  private Map<String, Object> context = new HashMap<String, Object>();

  public Object get(String key)
  {
    return this.context.get(key);
  }

  public void put(String key, Object value)
  {
    this.context.put(key, value);
  }
}