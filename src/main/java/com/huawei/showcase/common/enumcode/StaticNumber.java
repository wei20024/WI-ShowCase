package com.huawei.showcase.common.enumcode;

public enum StaticNumber
{
  ZERO(
    0), 

  ONE(
    1), 

  TWO(
    2), 

  THREE(
    3), 

  FOUR(
    4), 

  FIVE(
    5), 

  SIX(
    6), 

  SEVEN(
    7), 

  EIGHT(
    8), 

  NINE(
    9), 

  TEN(
    10), 

  ELEVEN(
    11), 

  FIFTY(
    15), 

  SIXTEEN(
    16), 

  TWENTY(
    20), 

  THIRTY(
    30), 

  THIRTYTWO(
    32), 

  SIXTY(
    60), 

  FIFTYS(
    50), 

  IMPORT_QUERY_MAX_COUNT(
    60000), 

  HASH_RESULT(
    17), 

  HASH_GENE(
    37), 

  FORBID(
    403), 

  ONE_HUNDRED(
    100), 

  ONE_THOUSAND(
    1000), 

  NANO_UNIT(
    1000000), 

  RENAME_VM_TMOUT(
    180000), 

  MILL_UNIT(
    10000), 

  OXFF(
    255);

  private int code;

  private StaticNumber(int code)
  {
    this.code = code;
  }

  public int getCode()
  {
    return this.code;
  }
}