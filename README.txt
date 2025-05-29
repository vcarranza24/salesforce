SALESFORCE

Front End: 

LocalHost:

Se adjunto los archivos en HTML / CSS3 

Backend : 

UTILICE POSTMAN PARA CONSULTA DE APIS
INSTALAR ANDROID STUDIO /  KOTLIN

ESTRUCTURA DE PROYECTO 
app/
├── data/
│   ├── model/
│   │   └── Person.kt
│   └── api/
│       ├── ApiService.kt
│       └── RetrofitClient.kt
├── ui/
│   ├── PersonAdapter.kt
│   └── MainActivity.kt
└── res/
    ├── layout/
    │   └── item_person.xml
    │   └── activity_main.xml
    └── drawable/

MODELO:

data class ApiResponse(
    val results: List<Person>
)

data class Person(
    val gender: String,
    val name: Name,
    val location: Location,
    val email: String,
    val dob: Dob,
    val picture: Picture
)

data class Name(val first: String, val last: String)
data class Location(val city: String, val country: String)
data class Dob(val date: String)
data class Picture(val large: String)


SERVICE:

import retrofit2.Call
import retrofit2.http.GET

interface ApiService {
    @GET("api/?results=10")
    fun getPeople(): Call<ApiResponse>
}


RETROFIT:

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "https://randomuser.me/"

    val instance: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}


PERSONADAPTER:

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide

class PersonAdapter(private val people: List<Person>) :
    RecyclerView.Adapter<PersonAdapter.PersonViewHolder>() {

    class PersonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imgPhoto: ImageView = itemView.findViewById(R.id.imgPhoto)
        val txtName: TextView = itemView.findViewById(R.id.txtName)
        val txtGender: TextView = itemView.findViewById(R.id.txtGender)
        val txtLocation: TextView = itemView.findViewById(R.id.txtLocation)
        val txtEmail: TextView = itemView.findViewById(R.id.txtEmail)
        val txtDob: TextView = itemView.findViewById(R.id.txtDob)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PersonViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_person, parent, false)
        return PersonViewHolder(view)
    }

    override fun onBindViewHolder(holder: PersonViewHolder, position: Int) {
        val person = people[position]
        holder.txtName.text = "${person.name.first} ${person.name.last}"
        holder.txtGender.text = "Género: ${if (person.gender == "male") "Masculino" else "Femenino"}"
        holder.txtLocation.text = "Ubicación: ${person.location.city}, ${person.location.country}"
        holder.txtEmail.text = "Email: ${person.email}"
        holder.txtDob.text = "Nacimiento: ${person.dob.date.take(10)}"
        Glide.with(holder.itemView).load(person.picture.large).into(holder.imgPhoto)
    }

    override fun getItemCount() = people.size
}


ACTIVITY MAIN:

<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>


PERSONA INTERFAZ:

<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    android:elevation="4dp">

    <LinearLayout
        android:orientation="vertical"
        android:padding="16dp"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <ImageView
            android:id="@+id/imgPhoto"
            android:layout_width="100dp"
            android:layout_height="100dp"
            android:layout_gravity="center_horizontal"
            android:scaleType="centerCrop"
            android:layout_marginBottom="8dp"/>

        <TextView android:id="@+id/txtName" android:layout_width="wrap_content" android:layout_height="wrap_content"/>
        <TextView android:id="@+id/txtGender" android:layout_width="wrap_content" android:layout_height="wrap_content"/>
        <TextView android:id="@+id/txtLocation" android:layout_width="wrap_content" android:layout_height="wrap_content"/>
        <TextView android:id="@+id/txtEmail" android:layout_width="wrap_content" android:layout_height="wrap_content"/>
        <TextView android:id="@+id/txtDob" android:layout_width="wrap_content" android:layout_height="wrap_content"/>
    </LinearLayout>
</androidx.cardview.widget.CardView>


import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

MAIN _ACTIVITY

class MainActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)

        RetrofitClient.instance.getPeople().enqueue(object : Callback<ApiResponse> {
            override fun onResponse(call: Call<ApiResponse>, response: Response<ApiResponse>) {
                if (response.isSuccessful) {
                    val people = response.body()?.results ?: emptyList()
                    recyclerView.adapter = PersonAdapter(people)
                }
            }

            override fun onFailure(call: Call<ApiResponse>, t: Throwable) {
                Log.e("MainActivity", "Error al obtener personas", t)
            }
        })
    }
}

