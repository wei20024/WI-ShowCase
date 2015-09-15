package com.huawei.showcase.common.util.log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.util.configration.Configuration;

@Service
public class LogMonitor
{
  private static final String ITA_HEARTBEATTIME = "LOG.Heartbeattime";
  private static final String CATALINA_MAX_PROP ="catalina.maxsize";
  private static final String LOG_MAX_PROP ="log.maxsize";
  private static final int CATALINA_MAXSIZE = 10485760;
  private static final int LOG_MAXSIZE = 104857600;
  private static final int LOG_MINSIZE = 52428800;
  private static final String TOMCATLOG_FILE_SUFFIX_log = ".log";
  private static final String TOMCATLOG_FILE_SUFFIX_zip = ".zip";
  private ScheduledThreadPoolExecutor executortimer;
  private String tomcatLogPath = System.getProperty("catalina.base") + "/logs";
  private String wibackLogPath = HRollingFileAppender.LOG_BACKUP_HOME;
  
  private Configuration configuration;

  @PostConstruct
  public void init()
  {
    this.configuration = Configuration.getControllerPropInstance();
    this.executortimer = new ScheduledThreadPoolExecutor(1);
    int interval = 2;
    this.executortimer.scheduleAtFixedRate(new Runnable()
    {
      public void run()
      {
        try
        {
          LogMonitor.this.logMoniter();
        }
        catch (Throwable e)
        {
          LogUtils.LOG.error("logMonitor have some errors:" + e);
        }
      }
    }
    , 0L, interval, TimeUnit.MINUTES);
  }

  private void logMoniter()
  {
    LogUtils.LOG.enterMethod();
    OutputStream os = null;
    File file = new File(this.tomcatLogPath + "/catalina.out");
    long filesize = 0L;
    long wiMaxsize = this.configuration.getInt(CATALINA_MAX_PROP, CATALINA_MAXSIZE);
    DecimalFormat df = new DecimalFormat("#.00");
    
     try 
     { 
       if ((file != null) && (file.exists()))
      {
        filesize = getFileSize(file);
        if (filesize >= wiMaxsize)
        {
          Date date = new Date();
          SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
          String dateString = sdf.format(date);
          String backupFolderPath = this.tomcatLogPath + "/catalina_" + dateString + TOMCATLOG_FILE_SUFFIX_log;
          File backupfile = new File(backupFolderPath);
          FileUtils.copyFile(file, backupfile);
          LogUtils.LOG.debug("catalina size:" + df.format(file.length() / 1048576.0D) + 
            "M");
          os = new FileOutputStream(file);
          os.write("".getBytes("utf-8"));
        }
      }
       
      String rootPath = HRollingFileAppender.LOG_PATH;
      
      File rootDirectory = new File(rootPath);
      
      long rootDirectorysize = getFileSize(rootDirectory);
      
      if (rootDirectorysize >= this.configuration.getInt(LOG_MAX_PROP, LOG_MAXSIZE))
      {
        File tomcatDirectory = new File(this.tomcatLogPath);
        long tomcatsize = getFileSize(tomcatDirectory);
        boolean ifdelete = deleteFile(tomcatDirectory, TOMCATLOG_FILE_SUFFIX_log, LOG_MINSIZE).booleanValue();

        if (ifdelete)
        {
          LogUtils.LOG.debug("delete tomcatPath files > 50M");
          return;
        }

        File backupDirectory = new File(this.wibackLogPath);
        long lSize = wiMaxsize + 104857600L - 52428800L - tomcatsize;
        LogUtils.LOG.debug("prepare for delete backuppath files size:" + 
          df.format(lSize / 1048576.0D) + "M");
        
        if (lSize <= 0L)
        {
          return;
        }
        
        int leaveSize = Long.valueOf(lSize).intValue();
        boolean backupdelete = deleteFile(backupDirectory, TOMCATLOG_FILE_SUFFIX_zip, leaveSize).booleanValue();
        
        if (backupdelete)
        {
          LogUtils.LOG.debug("delete tomcatPath and backuppath files > 50M");
          return;
        }
      } 
      else 
      {
        LogUtils.LOG.debug("/var/FusionAccess/WI dont over l00M;");
      }
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("logMoniter e:" + e);

      if (os != null)
      {
        try
        {
          os.close();
        }
        catch (IOException e1)
        {
          LogUtils.LOG.error("close OutputStream. IOException:" + e1);
        }
      }
    }
    finally
    {
      if (os != null)
      {
        try
        {
          os.close();
        }
        catch (IOException e)
        {
          LogUtils.LOG.error("close OutputStream. IOException:" + e);
        }
      }
    }
  LogUtils.LOG.exitMethod();
  }

  private long getFileSize(File file)
  {
    long size = 0L;
    if (file.isDirectory())
    {
      File[] flist = file.listFiles();

      if (flist == null)
      {
        return size;
      }

      for (int i = 0; i < flist.length; i++)
      {
        if (flist[i].isDirectory())
        {
          size += getFileSize(flist[i]);
        }
        else
        {
          size += flist[i].length();
        }
      }
    }
    else
    {
      size = file.length();
    }

    return size;
  }

  private Boolean deleteFile(File file, final String filesuffix, int limitsize)
  {
    File[] files = file.listFiles(new FilenameFilter()
    {
      public boolean accept(File dir, String name)
      {
        if (name.toLowerCase(Locale.US).endsWith(filesuffix))
        {
          return true;
        }

        return false;
      }
    });
    if (files == null)
    {
      LogUtils.LOG.error("Get file is null.");
      return Boolean.valueOf(false);
    }

    Arrays.sort(files, new Comparator<File>()
    {
      public int compare(File o1, File o2)
      {
        return o1.getName().compareTo(o2.getName());
      }

    });
    LogUtils.LOG.debug("start delete files");
    long tfilesize = 0L;
    for (File sfile : files)
    {
      long sfilesize = getFileSize(sfile);
      if (!sfile.delete())
      {
        LogUtils.LOG.error("Failed to deleteFile,filePath: " + sfile.getAbsolutePath());
      }
      else
      {
        LogUtils.LOG.debug("Success to deleteFile,filePath: " + sfile.getAbsolutePath());

        tfilesize += sfilesize;

        if (tfilesize > limitsize)
        {
          return Boolean.valueOf(true);
        }
      }
    }
    return Boolean.valueOf(false);
  }

  @PreDestroy
  public void closeLogMonitor()
  {
    LogUtils.LOG.debug("closeLogMonitor thread start");
    if (this.executortimer != null)
    {
      this.executortimer.shutdownNow();
    }
    LogUtils.LOG.debug("closeLogMonitor thread end");
  }
}