namespace AWS_B.model { 
public class Seller : User
{
    public override string Role => "Seller";
    private float seller_rating {get; set;}

    public required List<Car> carList {get; set;} 

    public Seller(){
        seller_rating = 0.0f;
        carList = new List<Car>();
    }

    public List<Car> GetAllCars(){
    return carList;
    }

    public void AddCar(Car car){
        carList.Add(car);
    } 
    

}}