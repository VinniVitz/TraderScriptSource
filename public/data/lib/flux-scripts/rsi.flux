+++name+++ = from(bucket: "+++influxbucket+++")
    |> range(start: -1m)
    |> filter(
        fn: (r) => r._measurement == "+++influxmeasurement+++" and r._field == "+++pricekey+++",
    )
    |> relativeStrengthIndex(n: +++period+++)