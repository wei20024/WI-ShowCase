package com.huawei.showcase.model.response;

import com.huawei.showcase.model.response.CommonRsp;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ChangePwdRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class ChangePwdRsp extends CommonRsp
{
  private static final long serialVersionUID = 237476630517176525L;

  @XmlElement(name="changeState")
  private int changeState;

  public int getChangeState()
  {
    return this.changeState;
  }

  public void setChangeState(int changeState)
  {
    this.changeState = changeState;
  }
}