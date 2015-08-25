package com.huawei.showcase.common.util.log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import org.apache.log4j.helpers.LogLog;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class ZipCompressor
{
  private static final int BUFFER = 1024;

  public static void zipFolder(String srcFolder, String destZipFile)
  {
    LogLog.debug("zip" + srcFolder);

    ZipOutputStream zip = null;
    FileOutputStream fileWriter = null;
    try
    {
      fileWriter = new FileOutputStream(destZipFile);
      zip = new ZipOutputStream(fileWriter);

      addFolderToZip("", srcFolder, zip);
      zip.flush();
      fileWriter.flush();
    }
    catch (FileNotFoundException e)
    {
      LogLog.error("zip failed" + e);
      try
      {
        if (zip != null)
        {
          zip.close();
        }
      }
      catch (Exception e2)
      {
        LogLog.error("zif failed" + e2);
      }

      try
      {
        if (fileWriter != null)
        {
          fileWriter.close();
        }
      } 
      catch (Exception e1)
      {
        LogLog.error("zif failed" + e1);
      }
    }
    catch (Exception e3)
    {
      LogLog.error("zip failed" + e3);
      try
      {
        if (zip != null)
        {
          zip.close();
        }
      }
      catch (Exception e)
      {
        LogLog.error("zif failed" + e);
      }

      try
      {
        if (fileWriter != null)
        {
          fileWriter.close();
        }
      }
      catch (Exception e)
      {
        LogLog.error("zif failed" + e);
      }
    }
    finally
    {
      try
      {
        if (zip != null)
        {
          zip.close();
        }
      }
      catch (Exception e)
      {
        LogLog.error("zif failed" + e);
      }

      try
      {
        if (fileWriter != null)
        {
          fileWriter.close();
        }
      }
      catch (Exception e)
      {
        LogLog.error("zif failed" + e);
      }
    }
  }

  private static void addFileToZip(String path, String srcFile, ZipOutputStream zip)
  {
    FileInputStream in = null;
    File folder = new File(srcFile);
    try
    {
      if (folder.isDirectory())
      {
        addFolderToZip(path, srcFile, zip);
      }
      else
      {
        byte[] buf = new byte[BUFFER];

        in = new FileInputStream(srcFile);
        zip.putNextEntry(new ZipEntry(path + "/" + folder.getName()));
        int len =0;
        while ((len = in.read(buf)) > 0)
        {
          zip.write(buf, 0, len);
        }
      }
    }
    catch (Exception e)
    {
      LogLog.error("zif failed" + e);
      try
      {
        if (in != null)
        {
          in.close();
        }
      }
      catch (IOException e1)
      {
        LogLog.error("zif failed" + e1);
      }
    }
    finally
    {
      try
      {
        if (in != null)
        {
          in.close();
        }
      }
      catch (IOException e)
      {
        LogLog.error("zif failed" + e);
      }
    }
  }

  private static void addFolderToZip(String path, String srcFolder, ZipOutputStream zip)
  {
    File folder = new File(srcFolder);

    for (String fileName : folder.list())
    {
      if (path.equals(""))
      {
        addFileToZip(folder.getName(), srcFolder + "/" + fileName, zip);
      }
      else
      {
        addFileToZip(path + "/" + folder.getName(), srcFolder + "/" + fileName, zip);
      }
    }
  }
}