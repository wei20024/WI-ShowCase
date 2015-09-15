package com.huawei.showcase.web.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.huawei.showcase.model.response.MonitorRsp;

@Path("monitor")
public abstract interface MonitorRest
{
  @GET
  @Path("/monitorStatus")
  @Produces({"application/json"})
  public abstract MonitorRsp monitorStatus();

}