package com.huawei.showcase.common.enumcode;

public enum VmVersionType
{
  V21(
    "R21"), 

  V51(
    "R51");

  private String name;

  private VmVersionType(String name)
  {
    this.name = name;
  }

  public String getName()
  {
    return this.name;
  }
}