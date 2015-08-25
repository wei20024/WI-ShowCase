package com.huawei.showcase.model.response;


import com.huawei.showcase.model.SessionModel;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetSessionByUserNameRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetSessionByUserNameRsp extends CommonRsp
{
  private static final long serialVersionUID = 3842525965071571959L;
  private String groupId;
  private List<SessionModel> sessionInfoList;

  public List<SessionModel> getSessionInfoList()
  {
    return this.sessionInfoList;
  }

  public void setSessionInfoList(List<SessionModel> sessionInfoList) {
    this.sessionInfoList = sessionInfoList;
  }

  public String getGroupId()
  {
    return this.groupId;
  }

  public void setGroupId(String groupId) {
    this.groupId = groupId;
  }

  public String toString()
  {
    StringBuilder strBuilder = new StringBuilder();
    strBuilder.append(super.toString());
    if (this.sessionInfoList != null)
    {
      strBuilder.append(",sessionInfoList.size=" + this.sessionInfoList.size());
    }
    return strBuilder.toString();
  }
}