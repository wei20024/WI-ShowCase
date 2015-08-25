package com.huawei.showcase.common.task.monitor;

import com.huawei.showcase.common.enumcode.StaticNumber;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScheduledTask
{

  @Autowired
  private WiMonitor wiMonitor;
  private ScheduledThreadPoolExecutor executortimer;

  @PostConstruct
  public void init()
  {
    this.executortimer = new ScheduledThreadPoolExecutor(StaticNumber.TWO.getCode());

    this.executortimer.scheduleAtFixedRate(this.wiMonitor, StaticNumber.THREE.getCode(), StaticNumber.THIRTY.getCode(), 
      TimeUnit.SECONDS);
  }

  @PreDestroy
  public void close()
  {
    if (this.executortimer != null)
    {
      this.executortimer.shutdown();
    }
  }

  public WiMonitor getWiMonitor()
  {
    return this.wiMonitor;
  }

  public void setWiMonitor(WiMonitor wiMonitor)
  {
    this.wiMonitor = wiMonitor;
  }
}