using System;

namespace Mayar.Api.Helpers;

public static class DateTimeHelper
{
    public static DateTime GetLocalTime()
    {
        // Kuwait/Middle East (Arabia Standard Time) is UTC+3. 
        // This region does not observe Daylight Saving Time, so a fixed offset is reliable.
        return DateTime.UtcNow.AddHours(3);
    } 
}
