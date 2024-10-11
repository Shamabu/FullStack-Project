namespace GradeMasterAPI.Servieces
{
    public class CsvLoader : ICsvLoader
    {
        string TestVal = "";
        public CsvLoader()
        {
            TestVal = Guid.NewGuid().ToString();
            
        }
        public string Test()
        {
            return TestVal;
        }
    }
}
