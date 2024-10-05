namespace AWS_B.model { 
public class Buyer : User
{
    public override string Role => "Buyer";
     public int BuyerId { get; set; }
        public string Name { get; set; }

}
}